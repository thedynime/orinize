export const runtime = 'nodejs';
export async function GET() { return Response.json({ demo: !process.env.OPENAI_API_KEY }); }
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length')) > 500000) return Response.json({ error: 'Conversation is too large.' }, { status: 413 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (!body || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > 100 || body.messages.some((m: {role: string; content: string}) => !m || !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 20000)) return Response.json({ error: 'Please send a valid conversation (up to 100 messages).' }, { status: 400 });
  if (!process.env.OPENAI_API_KEY) {
    const last = body.messages.at(-1).content as string;
    const answer = `This is a **demo conversation** — no AI provider is connected yet.\n\nYou asked: “${last.slice(0, 300)}”\n\nHere’s a useful way to get started:\n\n1. **Define the outcome.** What would a successful result look like?\n2. **Add context.** Share your audience, constraints, and any examples.\n3. **Break it down.** Work through one clear step at a time.\n\nOnce an API key is configured on the server, you can explore this with a live AI model. In the meantime, try switching themes or returning to this conversation from the sidebar.`;
    const encoder = new TextEncoder(); let index = 0;
    return new Response(new ReadableStream({ async pull(controller) { if (request.signal.aborted || index >= answer.length) {controller.close(); return;} controller.enqueue(encoder.encode(answer.slice(index, index + 12))); index += 12; await new Promise(r => setTimeout(r, 18)); } }), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Demo-Mode': 'true' } });
  }
  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', messages: body.messages, stream: true }), signal: AbortSignal.any([request.signal, AbortSignal.timeout(90000)]) });
    if (!upstream.ok || !upstream.body) return Response.json({ error: upstream.status === 429 ? 'The AI service is busy. Please try again shortly.' : 'Unable to reach the AI model. Please try again.' }, { status: 502 });
    const encoder = new TextEncoder(); const decoder = new TextDecoder();
    const stream = new ReadableStream({ async start(controller) { const reader = upstream.body!.getReader(); let buffer = ''; try { while (true) { const {done, value} = await reader.read(); if (done) break; buffer += decoder.decode(value, {stream: true}); const lines = buffer.split('\n'); buffer = lines.pop() || ''; for (const line of lines) { if (!line.startsWith('data: ') || line.slice(6).trim() === '[DONE]') continue; const data = JSON.parse(line.slice(6)); const text = data.choices?.[0]?.delta?.content; if (text) controller.enqueue(encoder.encode(text)); } } controller.close(); } catch (error) { controller.error(error); } finally { reader.releaseLock(); } } });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } });
  } catch { return Response.json({ error: 'The connection timed out. Please try again.' }, { status: 504 }); }
}
