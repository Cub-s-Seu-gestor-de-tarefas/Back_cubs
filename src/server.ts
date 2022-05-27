import { serverHTTP } from "./http"
import './websockets';

serverHTTP.listen(3001,()=>{console.log("server is running")});