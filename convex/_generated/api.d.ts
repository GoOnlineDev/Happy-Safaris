/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as about from "../about.js";
import type * as bookings from "../bookings.js";
import type * as clerk from "../clerk.js";
import type * as contact from "../contact.js";
import type * as conversations from "../conversations.js";
import type * as destinations from "../destinations.js";
import type * as hero from "../hero.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as support from "../support.js";
import type * as tours from "../tours.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  about: typeof about;
  bookings: typeof bookings;
  clerk: typeof clerk;
  contact: typeof contact;
  conversations: typeof conversations;
  destinations: typeof destinations;
  hero: typeof hero;
  http: typeof http;
  messages: typeof messages;
  support: typeof support;
  tours: typeof tours;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
