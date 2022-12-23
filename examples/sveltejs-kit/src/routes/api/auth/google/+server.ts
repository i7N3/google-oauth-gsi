import { OAuth2Client } from 'google-auth-library';
import { PRIVATE_GOOGLE_SECRET } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const oAuth2Client = new OAuth2Client(
	PUBLIC_GOOGLE_CLIENT_ID,
	PRIVATE_GOOGLE_SECRET,
	'postmessage'
);

export const POST: RequestHandler = async function POST({ url, request }) {
	console.log(`${request.method} | ${url.pathname}`);

	try {
		const payload = await request.json();

		if (!payload?.code) {
			throw error(400, 'No code provided');
		}

		// exchange code for tokens
		const { tokens } = await oAuth2Client.getToken(payload.code);
		return json(tokens);
	} catch (err) {
		throw error(500, { message: 'Internal error' });
	}
};
