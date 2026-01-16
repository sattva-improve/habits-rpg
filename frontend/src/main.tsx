import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import App from "./App";
import "./styles/tailwind.css";
import outputs from "../amplify_outputs.json";
import { seedService } from "./services/seed";

// Amplifyの設定
Amplify.configure(outputs);

// 開発環境のみ: デバッグ用にseedServiceを公開
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { seedService: typeof seedService }).seedService = seedService;
}

createRoot(document.getElementById("root")!).render(<App />);
