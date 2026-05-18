// Header section halaman untuk judul, breadcrumb, dan tombol aksi.
export default function PageHeader({ title, subtitle, actionLabel }) {
    // Memecah breadcrumb menjadi beberapa bagian supaya mudah dirender berurutan.
    const breadcrumbItems = subtitle.split(" /").map((item) => item.trim()).filter(Boolean);

    return (
        <div id="pageheader-container">
            <div id="pageheader-left">
                <span id="page-title">
                    {title}
                </span>
                <div id="breadcrumb-links">
                    {breadcrumbItems.map((item, index) => (
                        <div key={`${item}-${index}`}>
                            <span id={index === 0 ? "breadcrumb-home" : "breadcrumb-current"}>
                                {item}
                            </span>
                            {index < breadcrumbItems.length - 1 ? (
                                <span id="breadcrumb-separator"> / </span>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
            <div id="action-button">
                <button id="add-button">
	                {actionLabel}
	            </button>
            </div>
        </div>
    );
}
