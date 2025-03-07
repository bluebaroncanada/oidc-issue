export const STABLE = new Set([
  'backchannelLogout',
  'ciba',
  'claimsParameter',
  'clientCredentials',
  'deviceFlow',
  'devInteractions',
  'dPoP',
  'encryption',
  'fapi',
  'introspection',
  'jwtResponseModes',
  'jwtIntrospection',
  'jwtUserinfo',
  'mTLS',
  'pushedAuthorizationRequests',
  'registration',
  'registrationManagement',
  'requestObjects',
  'resourceIndicators',
  'revocation',
  'rpInitiatedLogout',
  'userinfo',
]);

export const DRAFTS = new Map(Object.entries({
  richAuthorizationRequests: {
    name: 'OAuth 2.0 Rich Authorization Requests',
    type: 'IETF OAuth Working Group RFC 9396',
    url: 'https://www.rfc-editor.org/rfc/rfc9396.html',
    version: ['experimental-01'],
  },
  webMessageResponseMode: {
    name: 'OAuth 2.0 Web Message Response Mode - draft 01',
    type: 'Individual draft',
    url: 'https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-01',
    version: ['individual-draft-01'],
  },
}));
