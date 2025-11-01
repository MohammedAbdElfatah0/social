import { GraphQLError } from "graphql";

export class AppError extends Error {
    constructor(message: string, public statusCode: number, public errorDetails?: Record<string, string>[]) {
        super(message);
    }
}

export class BadRequestException extends AppError {
    constructor(message: string, errorDetails?: Record<string, string>[]) {
        super(message, 400, errorDetails);
    }
}

export class UnAuthorizedException extends AppError {
    constructor(message: string, errorDetails?: Record<string, string>[]) {
        super(message, 401, errorDetails);
    }
}

export class NotFoundException extends AppError {
    constructor(message: string, errorDetails?: Record<string, string>[]) {
        super(message, 404, errorDetails);
    }
}

export class ConflictException extends AppError {
    constructor(message: string, errorDetails?: Record<string, string>[]) {
        super(message, 409, errorDetails);
    }
}

export class ForbiddenException extends AppError {
    constructor(message: string, errorDetails?: Record<string, string>[]) {
        super(message, 403, errorDetails);
    }
}

//graphql error
export const formatErrorGraphql = (error: Readonly<Error | GraphQLError>): Error | GraphQLError => {
    if (error instanceof GraphQLError) {
        const statusFromOriginal = error.originalError instanceof AppError ? error.originalError.statusCode : undefined;
        const statusFromExt = (error.extensions?.statusCode as number | undefined);
        const options: Record<string, unknown> = {
            extensions: {
                ...error.extensions,
                success: false,
                statusCode: statusFromExt ?? statusFromOriginal ?? 500,
            },
        };
        if (error.nodes != null) options.nodes = error.nodes;
        if (error.source != null) options.source = error.source;
        if (error.positions != null) options.positions = error.positions;
        if (error.path != null) options.path = error.path;
        if (error.originalError != null) options.originalError = error.originalError;
        return new GraphQLError(error.message, options as any);
    }
    // Generic Error
    return new GraphQLError(error.message, {
        extensions: {
            success: false,
            statusCode: 500,
        },
    });
}
