
interface Posting extends Model {}
interface Category extends Model {}
interface User extends Model {}

declare class HttpError {
  UNAUTHORIZED: string;
  UNPROCESSABLE_ENTITY: string;
  BAD_REQUEST: string;
  NOT_FOUND: string;
}
