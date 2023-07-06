import { NextReqest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { Configuration, OpenAIApi } from 'openai';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || '',
});

const KEY = process.env.OPENAI_API_KEY || '';
const configuration = new Configuration({
  apiKey: KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req, res) {
  try {
    const { query } = await req.json();
    const requestData = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: query }],
      functions: [
        {
          name: 'createMusic',
          description: 'call this function if the user asks to generate music',
          parameters: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'the exact prompt passed in',
              },
              duration: {
                type: 'number',
                description:
                  'if the user defines the length or duration of audio or music, return the number only',
              },
            },
          },
        },
        {
          name: 'createImage',
          description:
            'call this function if the user asks to generate an image',
          parameters: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'the exact prompt passed in',
              },
            },
          },
        },
      ],
    });
    let choice = requestData.choices[0];
    const { function_call } = choice.message;
    console.log('function call: ', function_call);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
