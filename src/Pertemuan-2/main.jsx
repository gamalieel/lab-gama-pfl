import { createRoot } from "react-dom/client";
import HelloWorld from "./HelloWorld";
import QuoteText from "./QueteText";
import Container from "./Container";
import './custom.css';

createRoot(document.getElementById("root"))
    .render(
        <div>

            <Container>
                <img src="img/wahyu.png" width="500" height="500" />
                 <HelloWorld/>
                 <QuoteText/>
            </Container>
            
            
        </div>
    )



    