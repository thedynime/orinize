import Landing from './landing';
import { getAppUrl } from './site-config';
export default function Page() { return <Landing appUrl={getAppUrl()}/>; }
