import { serverHTTP } from "./http"
import './websockets';

const PORT = process.env.PORT || 3001

serverHTTP.listen(PORT,()=>{console.log("server is running")});