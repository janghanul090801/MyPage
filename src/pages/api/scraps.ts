import type { APIRoute } from "astro";
import { PrismaClient } from "@prisma/client";

export const prerender = false;

const prisma = new PrismaClient();

export const GET: APIRoute = async () => {
    const scraps = await prisma.scrap.findMany({ orderBy: { createdAt: "desc" } });
    return new Response(JSON.stringify(scraps), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const text = await request.text();
        console.log("Raw body:", text);
        if (!text) {
            return new Response(JSON.stringify({ error: "Empty body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const body = JSON.parse(text);
        const { link } = body;

        if (!link) {
            return new Response(JSON.stringify({ error: "link is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const scrap = await prisma.scrap.create({ data: { link } });

        return new Response(JSON.stringify(scrap), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to create scrap" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
