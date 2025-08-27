import {defineCollection, z} from "astro:content";
import {glob} from "astro/loaders";

const blog = defineCollection({
    loader: glob({pattern: '**/*.mdx', base: "./src/blog"}),
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        brief: z.string(),
        image: z.optional(image()),
    })
});

export const collections = {blog};
