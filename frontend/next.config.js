/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    images: {
        domains: ['osondastur.uz'],
    },
    webpack(config, options) {
        config.module.rules.push({
            loader: '@svgr/webpack',
            issuer: /\.[jt]sx?$/,
            options: {
                prettier: false,
                svgo: true,
                svgoConfig: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                },
                            },
                        }
                    ],
                },
                titleProp: true,
            },
            test: /\.svg$/,
        });

        return config;
    },
};
