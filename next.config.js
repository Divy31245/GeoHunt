/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains:['flagcdn.com','mainfacts.com','upload.wikimedia.org']
  }
}

module.exports = nextConfig
