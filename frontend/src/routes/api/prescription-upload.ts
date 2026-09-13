import { createFileRoute } from '@tanstack/react-router'
import { issueSignedToken, presignUrl } from '@vercel/blob'

export const Route = createFileRoute('/api/prescription-upload')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()

          const fileName = body.fileName as string

          if (!fileName) {
            return Response.json(
              { detail: 'fileName is required' },
              { status: 400 },
            )
          }

          const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')

          const pathname =
            `prescriptions/${crypto.randomUUID()}-${safeFileName}`

          const token = await issueSignedToken({
            operations: ['put'],
          })

          const { presignedUrl } = await presignUrl(token, {
  pathname,
  operation: 'put',
  access: 'private',
  validUntil: Date.now() + 15 * 60 * 1000,
})

          return Response.json({
            pathname,
            presignedUrl,
          })
        } catch (error) {
          console.error('Prescription upload URL error:', error)

          return Response.json(
            { detail: 'Unable to create prescription upload URL' },
            { status: 500 },
          )
        }
      },
    },
  },
})