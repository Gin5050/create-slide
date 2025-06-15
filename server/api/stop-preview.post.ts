export default defineEventHandler(async (event) => {
    try {
        // プロセス管理は実際の本番環境では適切に実装する必要があります
        // ここでは簡単な実装例を示します

        return {
            success: true,
            message: 'Slidev preview stopped'
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to stop Slidev preview: ' + errorMessage
        })
    }
})
