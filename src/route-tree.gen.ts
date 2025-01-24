/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/root'
import { Route as mainSellerLayoutImport } from './routes/main/seller/layout'
import { Route as mainLayoutImport } from './routes/main/layout'
import { Route as authLayoutImport } from './routes/auth/layout'
import { Route as mainSellerOrdersImport } from './routes/main/seller/orders'
import { Route as mainSellerDashboardImport } from './routes/main/seller/dashboard'
import { Route as mainWishlistImport } from './routes/main/wishlist'
import { Route as mainMyPurchasesImport } from './routes/main/my-purchases'
import { Route as mainBrowseCarsImport } from './routes/main/browse-cars'
import { Route as mainBecomeSellerImport } from './routes/main/become-seller'
import { Route as authSignUpImport } from './routes/auth/sign-up'
import { Route as authSignInImport } from './routes/auth/sign-in'
import { Route as indexImport } from './routes/index'
import { Route as mainSellerListingsNewImport } from './routes/main/seller/listings/new'
import { Route as mainPaymentImport } from './routes/main/payment'
import { Route as mainListingImport } from './routes/main/listing'
import { Route as mainSellerListingsListingsImport } from './routes/main/seller/listings/listings'

// Create Virtual Routes

const SellerLayoutIdListingsImport = createFileRoute(
  '/_seller-layout-id/listings',
)()

// Create/Update Routes

const mainSellerLayoutRoute = mainSellerLayoutImport.update({
  id: '/_seller-layout-id',
  getParentRoute: () => rootRoute,
} as any)

const mainLayoutRoute = mainLayoutImport.update({
  id: '/_main-layout-id',
  getParentRoute: () => rootRoute,
} as any)

const authLayoutRoute = authLayoutImport.update({
  id: '/_auth-layout-id',
  getParentRoute: () => rootRoute,
} as any)

const mainSellerOrdersRoute = mainSellerOrdersImport.update({
  id: '/orders',
  path: '/orders',
  getParentRoute: () => mainSellerLayoutRoute,
} as any)

const SellerLayoutIdListingsRoute = SellerLayoutIdListingsImport.update({
  id: '/listings',
  path: '/listings',
  getParentRoute: () => mainSellerLayoutRoute,
} as any)

const mainSellerDashboardRoute = mainSellerDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => mainSellerLayoutRoute,
} as any)

const mainWishlistRoute = mainWishlistImport.update({
  id: '/wishlist',
  path: '/wishlist',
  getParentRoute: () => mainLayoutRoute,
} as any)

const mainMyPurchasesRoute = mainMyPurchasesImport.update({
  id: '/my-purchases',
  path: '/my-purchases',
  getParentRoute: () => mainLayoutRoute,
} as any)

const mainBrowseCarsRoute = mainBrowseCarsImport.update({
  id: '/browse-cars',
  path: '/browse-cars',
  getParentRoute: () => mainLayoutRoute,
} as any)

const mainBecomeSellerRoute = mainBecomeSellerImport.update({
  id: '/become-seller',
  path: '/become-seller',
  getParentRoute: () => mainLayoutRoute,
} as any)

const authSignUpRoute = authSignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => authLayoutRoute,
} as any)

const authSignInRoute = authSignInImport.update({
  id: '/sign-in',
  path: '/sign-in',
  getParentRoute: () => authLayoutRoute,
} as any)

const indexRoute = indexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => mainLayoutRoute,
} as any)

const mainSellerListingsNewRoute = mainSellerListingsNewImport.update({
  id: '/new',
  path: '/new',
  getParentRoute: () => SellerLayoutIdListingsRoute,
} as any)

const mainPaymentRoute = mainPaymentImport.update({
  id: '/payment/callback',
  path: '/payment/callback',
  getParentRoute: () => mainLayoutRoute,
} as any)

const mainListingRoute = mainListingImport.update({
  id: '/listings/$listingId',
  path: '/listings/$listingId',
  getParentRoute: () => mainLayoutRoute,
} as any)

const mainSellerListingsListingsRoute = mainSellerListingsListingsImport.update(
  {
    id: '/',
    path: '/',
    getParentRoute: () => SellerLayoutIdListingsRoute,
  } as any,
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth-layout-id': {
      id: '/_auth-layout-id'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof authLayoutImport
      parentRoute: typeof rootRoute
    }
    '/_main-layout-id': {
      id: '/_main-layout-id'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof mainLayoutImport
      parentRoute: typeof rootRoute
    }
    '/_seller-layout-id': {
      id: '/_seller-layout-id'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof mainSellerLayoutImport
      parentRoute: typeof rootRoute
    }
    '/_main-layout-id/': {
      id: '/_main-layout-id/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof indexImport
      parentRoute: typeof mainLayoutImport
    }
    '/_auth-layout-id/sign-in': {
      id: '/_auth-layout-id/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof authSignInImport
      parentRoute: typeof authLayoutImport
    }
    '/_auth-layout-id/sign-up': {
      id: '/_auth-layout-id/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof authSignUpImport
      parentRoute: typeof authLayoutImport
    }
    '/_main-layout-id/become-seller': {
      id: '/_main-layout-id/become-seller'
      path: '/become-seller'
      fullPath: '/become-seller'
      preLoaderRoute: typeof mainBecomeSellerImport
      parentRoute: typeof mainLayoutImport
    }
    '/_main-layout-id/browse-cars': {
      id: '/_main-layout-id/browse-cars'
      path: '/browse-cars'
      fullPath: '/browse-cars'
      preLoaderRoute: typeof mainBrowseCarsImport
      parentRoute: typeof mainLayoutImport
    }
    '/_main-layout-id/my-purchases': {
      id: '/_main-layout-id/my-purchases'
      path: '/my-purchases'
      fullPath: '/my-purchases'
      preLoaderRoute: typeof mainMyPurchasesImport
      parentRoute: typeof mainLayoutImport
    }
    '/_main-layout-id/wishlist': {
      id: '/_main-layout-id/wishlist'
      path: '/wishlist'
      fullPath: '/wishlist'
      preLoaderRoute: typeof mainWishlistImport
      parentRoute: typeof mainLayoutImport
    }
    '/_seller-layout-id/dashboard': {
      id: '/_seller-layout-id/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof mainSellerDashboardImport
      parentRoute: typeof mainSellerLayoutImport
    }
    '/_seller-layout-id/listings': {
      id: '/_seller-layout-id/listings'
      path: '/listings'
      fullPath: '/listings'
      preLoaderRoute: typeof SellerLayoutIdListingsImport
      parentRoute: typeof mainSellerLayoutImport
    }
    '/_seller-layout-id/orders': {
      id: '/_seller-layout-id/orders'
      path: '/orders'
      fullPath: '/orders'
      preLoaderRoute: typeof mainSellerOrdersImport
      parentRoute: typeof mainSellerLayoutImport
    }
    '/_seller-layout-id/listings/': {
      id: '/_seller-layout-id/listings/'
      path: '/'
      fullPath: '/listings/'
      preLoaderRoute: typeof mainSellerListingsListingsImport
      parentRoute: typeof SellerLayoutIdListingsImport
    }
    '/_main-layout-id/listings/$listingId': {
      id: '/_main-layout-id/listings/$listingId'
      path: '/listings/$listingId'
      fullPath: '/listings/$listingId'
      preLoaderRoute: typeof mainListingImport
      parentRoute: typeof mainLayoutImport
    }
    '/_main-layout-id/payment/callback': {
      id: '/_main-layout-id/payment/callback'
      path: '/payment/callback'
      fullPath: '/payment/callback'
      preLoaderRoute: typeof mainPaymentImport
      parentRoute: typeof mainLayoutImport
    }
    '/_seller-layout-id/listings/new': {
      id: '/_seller-layout-id/listings/new'
      path: '/new'
      fullPath: '/listings/new'
      preLoaderRoute: typeof mainSellerListingsNewImport
      parentRoute: typeof SellerLayoutIdListingsImport
    }
  }
}

// Create and export the route tree

interface authLayoutRouteChildren {
  authSignInRoute: typeof authSignInRoute
  authSignUpRoute: typeof authSignUpRoute
}

const authLayoutRouteChildren: authLayoutRouteChildren = {
  authSignInRoute: authSignInRoute,
  authSignUpRoute: authSignUpRoute,
}

const authLayoutRouteWithChildren = authLayoutRoute._addFileChildren(
  authLayoutRouteChildren,
)

interface mainLayoutRouteChildren {
  indexRoute: typeof indexRoute
  mainBecomeSellerRoute: typeof mainBecomeSellerRoute
  mainBrowseCarsRoute: typeof mainBrowseCarsRoute
  mainMyPurchasesRoute: typeof mainMyPurchasesRoute
  mainWishlistRoute: typeof mainWishlistRoute
  mainListingRoute: typeof mainListingRoute
  mainPaymentRoute: typeof mainPaymentRoute
}

const mainLayoutRouteChildren: mainLayoutRouteChildren = {
  indexRoute: indexRoute,
  mainBecomeSellerRoute: mainBecomeSellerRoute,
  mainBrowseCarsRoute: mainBrowseCarsRoute,
  mainMyPurchasesRoute: mainMyPurchasesRoute,
  mainWishlistRoute: mainWishlistRoute,
  mainListingRoute: mainListingRoute,
  mainPaymentRoute: mainPaymentRoute,
}

const mainLayoutRouteWithChildren = mainLayoutRoute._addFileChildren(
  mainLayoutRouteChildren,
)

interface SellerLayoutIdListingsRouteChildren {
  mainSellerListingsListingsRoute: typeof mainSellerListingsListingsRoute
  mainSellerListingsNewRoute: typeof mainSellerListingsNewRoute
}

const SellerLayoutIdListingsRouteChildren: SellerLayoutIdListingsRouteChildren =
  {
    mainSellerListingsListingsRoute: mainSellerListingsListingsRoute,
    mainSellerListingsNewRoute: mainSellerListingsNewRoute,
  }

const SellerLayoutIdListingsRouteWithChildren =
  SellerLayoutIdListingsRoute._addFileChildren(
    SellerLayoutIdListingsRouteChildren,
  )

interface mainSellerLayoutRouteChildren {
  mainSellerDashboardRoute: typeof mainSellerDashboardRoute
  SellerLayoutIdListingsRoute: typeof SellerLayoutIdListingsRouteWithChildren
  mainSellerOrdersRoute: typeof mainSellerOrdersRoute
}

const mainSellerLayoutRouteChildren: mainSellerLayoutRouteChildren = {
  mainSellerDashboardRoute: mainSellerDashboardRoute,
  SellerLayoutIdListingsRoute: SellerLayoutIdListingsRouteWithChildren,
  mainSellerOrdersRoute: mainSellerOrdersRoute,
}

const mainSellerLayoutRouteWithChildren =
  mainSellerLayoutRoute._addFileChildren(mainSellerLayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof mainSellerLayoutRouteWithChildren
  '/': typeof indexRoute
  '/sign-in': typeof authSignInRoute
  '/sign-up': typeof authSignUpRoute
  '/become-seller': typeof mainBecomeSellerRoute
  '/browse-cars': typeof mainBrowseCarsRoute
  '/my-purchases': typeof mainMyPurchasesRoute
  '/wishlist': typeof mainWishlistRoute
  '/dashboard': typeof mainSellerDashboardRoute
  '/listings': typeof SellerLayoutIdListingsRouteWithChildren
  '/orders': typeof mainSellerOrdersRoute
  '/listings/': typeof mainSellerListingsListingsRoute
  '/listings/$listingId': typeof mainListingRoute
  '/payment/callback': typeof mainPaymentRoute
  '/listings/new': typeof mainSellerListingsNewRoute
}

export interface FileRoutesByTo {
  '': typeof mainSellerLayoutRouteWithChildren
  '/': typeof indexRoute
  '/sign-in': typeof authSignInRoute
  '/sign-up': typeof authSignUpRoute
  '/become-seller': typeof mainBecomeSellerRoute
  '/browse-cars': typeof mainBrowseCarsRoute
  '/my-purchases': typeof mainMyPurchasesRoute
  '/wishlist': typeof mainWishlistRoute
  '/dashboard': typeof mainSellerDashboardRoute
  '/orders': typeof mainSellerOrdersRoute
  '/listings': typeof mainSellerListingsListingsRoute
  '/listings/$listingId': typeof mainListingRoute
  '/payment/callback': typeof mainPaymentRoute
  '/listings/new': typeof mainSellerListingsNewRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth-layout-id': typeof authLayoutRouteWithChildren
  '/_main-layout-id': typeof mainLayoutRouteWithChildren
  '/_seller-layout-id': typeof mainSellerLayoutRouteWithChildren
  '/_main-layout-id/': typeof indexRoute
  '/_auth-layout-id/sign-in': typeof authSignInRoute
  '/_auth-layout-id/sign-up': typeof authSignUpRoute
  '/_main-layout-id/become-seller': typeof mainBecomeSellerRoute
  '/_main-layout-id/browse-cars': typeof mainBrowseCarsRoute
  '/_main-layout-id/my-purchases': typeof mainMyPurchasesRoute
  '/_main-layout-id/wishlist': typeof mainWishlistRoute
  '/_seller-layout-id/dashboard': typeof mainSellerDashboardRoute
  '/_seller-layout-id/listings': typeof SellerLayoutIdListingsRouteWithChildren
  '/_seller-layout-id/orders': typeof mainSellerOrdersRoute
  '/_seller-layout-id/listings/': typeof mainSellerListingsListingsRoute
  '/_main-layout-id/listings/$listingId': typeof mainListingRoute
  '/_main-layout-id/payment/callback': typeof mainPaymentRoute
  '/_seller-layout-id/listings/new': typeof mainSellerListingsNewRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/'
    | '/sign-in'
    | '/sign-up'
    | '/become-seller'
    | '/browse-cars'
    | '/my-purchases'
    | '/wishlist'
    | '/dashboard'
    | '/listings'
    | '/orders'
    | '/listings/'
    | '/listings/$listingId'
    | '/payment/callback'
    | '/listings/new'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/'
    | '/sign-in'
    | '/sign-up'
    | '/become-seller'
    | '/browse-cars'
    | '/my-purchases'
    | '/wishlist'
    | '/dashboard'
    | '/orders'
    | '/listings'
    | '/listings/$listingId'
    | '/payment/callback'
    | '/listings/new'
  id:
    | '__root__'
    | '/_auth-layout-id'
    | '/_main-layout-id'
    | '/_seller-layout-id'
    | '/_main-layout-id/'
    | '/_auth-layout-id/sign-in'
    | '/_auth-layout-id/sign-up'
    | '/_main-layout-id/become-seller'
    | '/_main-layout-id/browse-cars'
    | '/_main-layout-id/my-purchases'
    | '/_main-layout-id/wishlist'
    | '/_seller-layout-id/dashboard'
    | '/_seller-layout-id/listings'
    | '/_seller-layout-id/orders'
    | '/_seller-layout-id/listings/'
    | '/_main-layout-id/listings/$listingId'
    | '/_main-layout-id/payment/callback'
    | '/_seller-layout-id/listings/new'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  authLayoutRoute: typeof authLayoutRouteWithChildren
  mainLayoutRoute: typeof mainLayoutRouteWithChildren
  mainSellerLayoutRoute: typeof mainSellerLayoutRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  authLayoutRoute: authLayoutRouteWithChildren,
  mainLayoutRoute: mainLayoutRouteWithChildren,
  mainSellerLayoutRoute: mainSellerLayoutRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "root.tsx",
      "children": [
        "/_auth-layout-id",
        "/_main-layout-id",
        "/_seller-layout-id"
      ]
    },
    "/_auth-layout-id": {
      "filePath": "auth/layout.tsx",
      "children": [
        "/_auth-layout-id/sign-in",
        "/_auth-layout-id/sign-up"
      ]
    },
    "/_main-layout-id": {
      "filePath": "main/layout.tsx",
      "children": [
        "/_main-layout-id/",
        "/_main-layout-id/become-seller",
        "/_main-layout-id/browse-cars",
        "/_main-layout-id/my-purchases",
        "/_main-layout-id/wishlist",
        "/_main-layout-id/listings/$listingId",
        "/_main-layout-id/payment/callback"
      ]
    },
    "/_seller-layout-id": {
      "filePath": "main/seller/layout.tsx",
      "children": [
        "/_seller-layout-id/dashboard",
        "/_seller-layout-id/listings",
        "/_seller-layout-id/orders"
      ]
    },
    "/_main-layout-id/": {
      "filePath": "index.tsx",
      "parent": "/_main-layout-id"
    },
    "/_auth-layout-id/sign-in": {
      "filePath": "auth/sign-in.tsx",
      "parent": "/_auth-layout-id"
    },
    "/_auth-layout-id/sign-up": {
      "filePath": "auth/sign-up.tsx",
      "parent": "/_auth-layout-id"
    },
    "/_main-layout-id/become-seller": {
      "filePath": "main/become-seller.tsx",
      "parent": "/_main-layout-id"
    },
    "/_main-layout-id/browse-cars": {
      "filePath": "main/browse-cars.tsx",
      "parent": "/_main-layout-id"
    },
    "/_main-layout-id/my-purchases": {
      "filePath": "main/my-purchases.tsx",
      "parent": "/_main-layout-id"
    },
    "/_main-layout-id/wishlist": {
      "filePath": "main/wishlist.tsx",
      "parent": "/_main-layout-id"
    },
    "/_seller-layout-id/dashboard": {
      "filePath": "main/seller/dashboard.tsx",
      "parent": "/_seller-layout-id"
    },
    "/_seller-layout-id/listings": {
      "filePath": "",
      "parent": "/_seller-layout-id",
      "children": [
        "/_seller-layout-id/listings/",
        "/_seller-layout-id/listings/new"
      ]
    },
    "/_seller-layout-id/orders": {
      "filePath": "main/seller/orders.tsx",
      "parent": "/_seller-layout-id"
    },
    "/_seller-layout-id/listings/": {
      "filePath": "main/seller/listings/listings.tsx",
      "parent": "/_seller-layout-id/listings"
    },
    "/_main-layout-id/listings/$listingId": {
      "filePath": "main/listing.tsx",
      "parent": "/_main-layout-id"
    },
    "/_main-layout-id/payment/callback": {
      "filePath": "main/payment.tsx",
      "parent": "/_main-layout-id"
    },
    "/_seller-layout-id/listings/new": {
      "filePath": "main/seller/listings/new.tsx",
      "parent": "/_seller-layout-id/listings"
    }
  }
}
ROUTE_MANIFEST_END */
