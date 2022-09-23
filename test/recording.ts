import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  RecordingEntry,
} from '@jupiterone/integration-sdk-testing';
export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: mutateRecordingEntry,
    options: {
      ...input.options,
      matchRequestsBy: {
        url: false,
      },
    },
  });
}

function mutateRecordingEntry(entry: RecordingEntry): void {
  const responseText = entry.response.content.text;
  if (!responseText) {
    return;
  }

  const responseJson = JSON.parse(responseText);

  if (/login/.exec(entry.request.url) && entry.request.postData) {
    // Redact request body with secrets for authentication
    entry.request.postData.text = '[REDACTED]';

    // Redact authentication response token
    if (responseJson.access_token) {
      entry.response.content.text = JSON.stringify(
        {
          ...responseJson,
          access_token: '[REDACTED]',
        },
        null,
        0,
      );
    }
  }
}
