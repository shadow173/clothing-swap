const response = (message: string) => ({
  type: "object",
  required: ["message", "data"],
  properties: {
    message: {
      type: "string",
      default: message,
    },
    data: {
      type: "object",
      properties: {},
      additionalProperties: {
        type: "string",
      },
      example: {
        fieldName: "Error Message",
      },
    },
  },
});

export const responsesConfig = {
  400: {
    description: "Unexpected or invalid body.",
    ...response("One or more of the specified fields are invalid."),
  },
  401: {
    description: "Invalid access token.",
    ...response("Your access token has either expired or is invalid."),
  },
  403: {
    description: "You do not have permission to access this resource.",
    ...response(
      "You do not have permission to access this resource, please ensure you are logged in."
    ),
  },
  404: {
    description: "The specified resource could not be found.",
    ...response(
      "This resource could not be found, please ensure that the path is correct."
    ),
  },
  409: {
    description: "Conflicting resource found.",
    ...response("One or more fields is conflicting and needs to be modified."),
  },
  415: {
    description: "No valid files present on request.",
    ...response(
      "No files could be found on the request, please provid eat least one valid file."
    ),
  },
  500: {
    description: "Internal server error.",
    ...response(
      "An unknown internal server error has occurred, please try again."
    ),
  },
};
