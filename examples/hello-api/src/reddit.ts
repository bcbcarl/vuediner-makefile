import { get, validate } from "./utils/index";
import { fetchPostsSchema } from "./reddit.schema";

export const fetchPosts = async (reddit: string) => {
  try {
    const json = validate(fetchPostsSchema, await get(`/r/${reddit}.json`).end());
    return json.data.children.map((child) => child.data);
  } catch (error) {
    throw error;
  }
};
