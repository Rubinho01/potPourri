import {SiteHeader} from './site-header';import {SiteFooter} from './site-footer';import {SiteTopBar} from './site-top-bar';
export function SiteShell({children}:{children:React.ReactNode}){return <div className="flex min-h-screen flex-col"><SiteTopBar/><SiteHeader/><main className="flex-1">{children}</main><SiteFooter/></div>}
