export const fetchPostsSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "data": {
      "type": "object",
      "properties": {
        "children": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "data": {
                "type": "object",
                "properties": {
                  "domain": {
                    "type": "string"
                  },
                  "subreddit": {
                    "type": "string"
                  },
                  "id": {
                    "type": "string"
                  },
                  "author": {
                    "type": "string"
                  },
                  "permalink": {
                    "type": "string"
                  },
                  "url": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "created_utc": {
                    "type": "integer"
                  },
                  "num_comments": {
                    "type": "integer"
                  }
                },
                "required": [
                  "domain",
                  "subreddit",
                  "id",
                  "author",
                  "permalink",
                  "url",
                  "title",
                  "created_utc",
                  "num_comments"
                ]
              }
            },
            "required": [
              "data"
            ]
          }
        }
      },
      "required": [
        "children"
      ]
    }
  },
  "required": [
    "data"
  ]
};
