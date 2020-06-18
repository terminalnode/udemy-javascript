/* Note to self:
 The API the course originally used doesn't work anymore,
 but fret not for Jonas made us a replacement API. This API
 does not require any API key or proxy, and the URL is:
 forkify-api.herokuapp.com (where there's also some basic documentation)

 Remove all instances of ${PROXY} and ${KEY} from the course material.
*/

import Search from "./models/Search";

const search = new Search("pizza");
search.getResults();