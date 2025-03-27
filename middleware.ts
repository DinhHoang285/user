import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, supportedLocales } from 'src/constants';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Skip files & API routes
  // Ignore API routes, _next/static files, and other assets
  const blockedExtensions = /\.(png|jpg|jpeg|gif|svg|webp|css|js|json|txt|ico|woff|woff2|ttf|eot|mp4|webm|pdf)$/;
  if (blockedExtensions.test(pathname)) {
    return NextResponse.next();
  }
  if (
    pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/.next')
  ) {
    return NextResponse.next();
  }

  const [session, cookieState] = await Promise.all([
    getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as any,
    cookies()
  ]);
  const url = req.nextUrl;
  const { device } = userAgent(req);
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop';
  url.searchParams.set('viewport', viewport);

  // no auth
  if ((pathname.includes('/my-account') && !session?.user?._id)
    || (pathname.includes('/my-gallery') && !session?.user?._id)
    || (pathname.includes('/my-video') && !session?.user?._id)
    || (pathname.includes('/my-store') && !session?.user?._id)
    || (pathname.includes('/my-post') && !session?.user?._id)
    || (pathname.includes('/payout-request') && !session?.user?._id)
    || (pathname.includes('/earning') && !session?.user?._id)
    || (pathname.includes('/user/') && !session?.user?._id)
    || (pathname.includes('/streaming/') && !session?.user?._id)
    || (pathname.includes('/messages') && !session?.user?._id)
    || (pathname.includes('/reels') && !session?.user?._id)
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  // redirect if logged in
  if ((pathname.includes('login') || pathname.includes('register')) && !!session?.user?._id) {
    if (!session?.user?.isPerformer) {
      return NextResponse.redirect(!session?.user?.email || !session?.user?.username ? new URL('/user/account', req.url) : new URL('/home', req.url));
    }
    return NextResponse.redirect(!session?.user?.email || !session?.user?.username
      ? new URL('/my-account', req.url)
      : new URL(`/${session?.user.username}`, req.url));
  }
  // only performer
  if ((
    pathname.includes('/streaming/live')
    || pathname.includes('/my-account/')
    || pathname.includes('/my-gallery/')
    || pathname.includes('/my-video/')
    || pathname.includes('/my-store/')
    || pathname.includes('/my-post/')
    || pathname.includes('/my-earning')
    || pathname.includes('/payout-request')
  ) && session?.user?.isPerformer && !session?.user?.verifiedDocument) {
    return NextResponse.redirect(new URL(`/${session.user.username}`, req.url));
  }
  const locale = supportedLocales.find((loc) => pathname.startsWith(`/${loc}`));
  const cookieLocale = cookieState.get('locale')?.value || defaultLocale;
  // Redirect to the default locale if none is found
  if (!locale) {
    req.cookies.set('locale', cookieLocale);
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname}`, req.url));
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|logo.png|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
