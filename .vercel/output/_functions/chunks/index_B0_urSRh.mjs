import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/auth/github/index.ts
var github_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ redirect }) => {
	return redirect(`https://github.com/login/oauth/authorize?client_id=Ov23liRMt6VbL9huR7wK&scope=read:user%20read:org%20repo`, 302);
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/github/index@_@ts
var page = () => github_exports;
//#endregion
export { page };
