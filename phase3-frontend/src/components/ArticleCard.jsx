import { useState } from "react";

export default function ArticleCard({ article }) {
    const [showUpdated, setShowUpdated] = useState(false);

    const content = showUpdated
        ? article.updated_content || "No updated version yet."
        : article.original_content;

    return (
        <div className="card">
            <h2>{article.title}</h2>

            <button onClick={() => setShowUpdated(!showUpdated)}>
                {showUpdated ? "Show Original" : "Show Updated"}
            </button>

            <p className="article-content">
                {content}
            </p>
        </div>
    );
}
