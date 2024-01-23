/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            },
            {
                source: '/admin',
                destination: '/admin/users',
                permanent: false,
            },
        ]
    }
}

module.exports = nextConfig
