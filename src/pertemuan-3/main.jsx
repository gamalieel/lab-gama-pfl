import { createRoot } from "react-dom/client";
import TailwindCSS from "./TailwindCSS";
import "./tailwind.css";
import Typography from "./Typography";
import UserForm from "./UserForm";
import InputField from "./components/InputField";
import HitungGajiForm from "./HitungGajiForm";

createRoot(document.getElementById("root"))
.render(
    <div>
    <TailwindCSS />
    <Typography />
    <flexboxGrid />
    <UserForm /> 
    <HitungGajiForm />
    <InputField />
    </div>
);
