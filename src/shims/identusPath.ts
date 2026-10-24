const path = {
  dirname: () => "/",
  join: (...parts: string[]) => parts.join("/").replace(/\/+/g, "/"),
};

export default path;
export const dirname = path.dirname;
export const join = path.join;
