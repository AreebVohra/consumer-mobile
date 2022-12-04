/* eslint-disable implicit-arrow-linebreak */
import inherits from 'utils/inherits';

function RequestError(error) {
  if (error instanceof RequestError) {
    return error;
  }

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    this.code = error.response.status;
    this.message = 'The request was made and the server responded with a status code that '
      + 'falls out of the range of 2xx';
    this.errors = error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    this.code = 'no-response';
    this.message = 'The request was made but no response was received.';
  } else {
    // Something happened in setting up the request that triggered an Error
    this.code = 'unkown';
    this.message = 'Something happened in setting up the request that triggered an Error';
  }

  return this.message;
}
inherits(RequestError, Error);

RequestError.prototype.toPlainObject = () => ({
  code: this.code,
  message: this.message,
  errors: this.errors,
});

RequestError.prototype.toJSON = () =>
  // Return the plain object representation in case JSON.stringify is called on
  // an auth error instance.
  this.toPlainObject();
export default RequestError;
