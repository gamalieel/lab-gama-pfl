import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkList() {

    /** Deklarasi state **/
    // const [searchTerm, setSearchTerm] = useState("");
    // const [selectedTag, setSelectedTag] = useState("");

    /*Inisialisasi DataForm*/
    const [dataForm, setDataForm] = useState({
        searchTerm: "",
        selectedTag: "",
        /*Tambah state lain beserta default value*/
    });

    /*Inisialisasi Handle perubahan nilai input form*/
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    /** Deklarasi Logic Search & Filter **/
    const _searchTerm = dataForm.searchTerm.toLowerCase();

    const filteredFrameworks = frameworkData.filter((framework) => {
        const matchesSearch =
            framework.name.toLowerCase().includes(_searchTerm) ||
            framework.description.toLowerCase().includes(_searchTerm) ||
            framework.details.developer.toLowerCase().includes(_searchTerm);

        const matchesTag = dataForm.selectedTag
            ? framework.tags.includes(dataForm.selectedTag)
            : true;

        return matchesSearch && matchesTag;
    });

    /** Deklarasi unique tags frameworkData  **/
    const allTags = [
        ...new Set(frameworkData.flatMap((framework) => framework.tags)),
    ];

    return (
        <div className="p-8">

            <input
                type="text"
                name="searchTerm"
                placeholder="Search framework..."
                value={dataForm.searchTerm}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <select
                name="selectedTag"
                value={dataForm.selectedTag}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            >
                <option value="">All Tags</option>
                {allTags.map((tag, index) => (
                    <option key={index} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>

            {filteredFrameworks.map((item) => (
                <div key={item.id} className="border p-4 mb-4 rounded-lg shadow-md bg-white">
                    <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600">{item.description}</p>

                    <p className="text-gray-600">{item.details.developer}</p>
                    <p className="text-gray-600">{item.details.releaseYear}</p>

                    <a
                        href={item.details.officialWebsite}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {item.details.officialWebsite}
                    </a>

                    <br />

                    {item.tags.map((tag, index) => (
                        <div
                            key={index}
                            className="bg-red-300 mb-1 text-center
                            hover:rotate-1
                            text-gray-700 px-2 py-1 
                            text-xs rounded-full mr-2"
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}