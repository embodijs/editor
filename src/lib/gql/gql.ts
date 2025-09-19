/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n\tquery GetRepos($amount: Int!) {\n\t\tviewer {\n\t\t\trepositories(first: $amount, orderBy: { field: UPDATED_AT, direction: DESC }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t\tdescription\n\t\t\t\t\towner {\n\t\t\t\t\t\tlogin\n\t\t\t\t\t}\n\t\t\t\t\tname\n\t\t\t\t\tnameWithOwner\n\t\t\t\t\tisPrivate\n\t\t\t\t\tviewerPermission\n\t\t\t\t\tdefaultBranchRef {\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\n\t\t\t\t\t# Check root directory files using the actual branch\n\t\t\t\t\thasEmbodiConfigTs: object(expression: \"HEAD:.embodi.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasEmbodiConfigJs: object(expression: \"HEAD:.embodi.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigJs: object(expression: \"HEAD:astro.config.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigTs: object(expression: \"HEAD:astro.config.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigMjs: object(expression: \"HEAD:astro.config.mjs\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": typeof types.GetReposDocument,
    "\n\tquery GetUser {\n\t\tviewer {\n\t\t\tname\n\t\t\tid\n\t\t\temail\n\t\t\tavatarUrl\n\t\t\tlogin\n\t\t}\n\t}\n": typeof types.GetUserDocument,
};
const documents: Documents = {
    "\n\tquery GetRepos($amount: Int!) {\n\t\tviewer {\n\t\t\trepositories(first: $amount, orderBy: { field: UPDATED_AT, direction: DESC }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t\tdescription\n\t\t\t\t\towner {\n\t\t\t\t\t\tlogin\n\t\t\t\t\t}\n\t\t\t\t\tname\n\t\t\t\t\tnameWithOwner\n\t\t\t\t\tisPrivate\n\t\t\t\t\tviewerPermission\n\t\t\t\t\tdefaultBranchRef {\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\n\t\t\t\t\t# Check root directory files using the actual branch\n\t\t\t\t\thasEmbodiConfigTs: object(expression: \"HEAD:.embodi.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasEmbodiConfigJs: object(expression: \"HEAD:.embodi.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigJs: object(expression: \"HEAD:astro.config.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigTs: object(expression: \"HEAD:astro.config.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigMjs: object(expression: \"HEAD:astro.config.mjs\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetReposDocument,
    "\n\tquery GetUser {\n\t\tviewer {\n\t\t\tname\n\t\t\tid\n\t\t\temail\n\t\t\tavatarUrl\n\t\t\tlogin\n\t\t}\n\t}\n": types.GetUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetRepos($amount: Int!) {\n\t\tviewer {\n\t\t\trepositories(first: $amount, orderBy: { field: UPDATED_AT, direction: DESC }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t\tdescription\n\t\t\t\t\towner {\n\t\t\t\t\t\tlogin\n\t\t\t\t\t}\n\t\t\t\t\tname\n\t\t\t\t\tnameWithOwner\n\t\t\t\t\tisPrivate\n\t\t\t\t\tviewerPermission\n\t\t\t\t\tdefaultBranchRef {\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\n\t\t\t\t\t# Check root directory files using the actual branch\n\t\t\t\t\thasEmbodiConfigTs: object(expression: \"HEAD:.embodi.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasEmbodiConfigJs: object(expression: \"HEAD:.embodi.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigJs: object(expression: \"HEAD:astro.config.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigTs: object(expression: \"HEAD:astro.config.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigMjs: object(expression: \"HEAD:astro.config.mjs\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetRepos($amount: Int!) {\n\t\tviewer {\n\t\t\trepositories(first: $amount, orderBy: { field: UPDATED_AT, direction: DESC }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\turl\n\t\t\t\t\tdescription\n\t\t\t\t\towner {\n\t\t\t\t\t\tlogin\n\t\t\t\t\t}\n\t\t\t\t\tname\n\t\t\t\t\tnameWithOwner\n\t\t\t\t\tisPrivate\n\t\t\t\t\tviewerPermission\n\t\t\t\t\tdefaultBranchRef {\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\n\t\t\t\t\t# Check root directory files using the actual branch\n\t\t\t\t\thasEmbodiConfigTs: object(expression: \"HEAD:.embodi.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasEmbodiConfigJs: object(expression: \"HEAD:.embodi.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigJs: object(expression: \"HEAD:astro.config.js\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigTs: object(expression: \"HEAD:astro.config.ts\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t\thasAstroConfigMjs: object(expression: \"HEAD:astro.config.mjs\") {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetUser {\n\t\tviewer {\n\t\t\tname\n\t\t\tid\n\t\t\temail\n\t\t\tavatarUrl\n\t\t\tlogin\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetUser {\n\t\tviewer {\n\t\t\tname\n\t\t\tid\n\t\t\temail\n\t\t\tavatarUrl\n\t\t\tlogin\n\t\t}\n\t}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;