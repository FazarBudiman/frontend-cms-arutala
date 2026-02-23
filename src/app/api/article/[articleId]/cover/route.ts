import { ApiError } from "@/server/errors/api-error";
import { serverFetch } from "@/server/http/server-fetch";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: { params: Promise<{ articleId: string }> }) {
    try {
        const formData = await request.formData();
        const { articleId } = await context.params;
        await serverFetch(`/article/${articleId}/cover`, {
            method: "POST",
            body: formData,
        });

        return NextResponse.json({ success: true,  data: null });
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: error.status },
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 },
        );
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ articleId: string }> }) {
    try {
        const formData = await request.formData();
        const { articleId } = await context.params;
        await serverFetch(`/article/${articleId}/cover`, {
            method: "PATCH",
            body: formData,
        });

        return NextResponse.json({ success: true,  data: null });
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: error.status },
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 },
        );
    }
}