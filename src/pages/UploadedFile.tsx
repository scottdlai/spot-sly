import { useState } from 'react'
import { TreeView, type TreeDataItem } from '@/components/tree-view'
import responseData from '@/assets/response.json'

type Section = {
    title: string
    text: string
    level: string
}

export default function UploadedFile() {
    // State to track the selected section
    const [selectedSection, setSelectedSection] = useState<Section | null>(
        responseData.sections[0] || null
    )

    // Transform sections from JSON into TreeDataItem format
    const treeData: TreeDataItem[] = responseData.sections.map((section, index) => ({
        id: `section-${index}`,
        name: section.title,
        onClick: () => {
            setSelectedSection(section)
        }
    }))

    // Split text into paragraphs (split by periods followed by space, then group into reasonable chunks)
    const splitTextIntoParagraphs = (text: string): string[] => {
        // Split by periods followed by spaces, then group every ~3-4 sentences into a paragraph
        const sentences = text.split(/(?<=\.)\s+/).filter(s => s.trim().length > 0)
        const paragraphs: string[] = []
        const sentencesPerParagraph = 3

        for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
            paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(' '))
        }

        return paragraphs.length > 0 ? paragraphs : [text]
    }

    return (
        <div className="grid grid-cols-4 w-full max-w-full overflow-x-hidden gap-8 lg:gap-32 p-4 lg:p-12">
            <div className="flex flex-col col-span-1 gap-1 select-none" id="tree-structure">
                <TreeView
                    data={treeData}
                    initialSelectedItemId="section-0"
                    onSelectChange={(item) => {
                        // Sync TreeView selection with component state
                        if (item) {
                            const sectionIndex = parseInt(item.id.replace('section-', ''))
                            setSelectedSection(responseData.sections[sectionIndex])
                        }
                    }}
                />
            </div>

            <main className="col-span-3 w-full flex flex-col items-center gap-10 *:w-full *:max-w-xl">
                {/* OVERLAY */}
                <div className="select-none gradient-overlay w-full max-w-full absolute h-1/4 bg-red-50 bottom-0 fixed">
                </div>


                {selectedSection && (
                    <>
                        <div className="flex flex-col gap-1 mt-3.5 select-none">
                            <span className="text-primary-subtle">{selectedSection.level}</span>
                            <h2 className="title-1 text-on">{selectedSection.title.replace(/\n/g, ' ')}</h2>
                        </div>

                        <div id="selected-section" className="*:block *:font-serif *:paragraph-text *:text-on [&>*:not(:last-child)]:mb-6 pb-1">
                            {splitTextIntoParagraphs(selectedSection.text).map((paragraph, index) => (
                                <span key={index}>
                                    {paragraph}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                <div className="w-full flex flex-col gap-2 fixed bottom-4 items-center">
                    <div className="buttons flex flex-row gap-2.5">
                        <button className="bg-surface-med flex gap-2.5">
                            <span className="text-primary">500 WPM</span>
                            <span className="text-on">Change</span></button>
                        <button className="bg-surface-med text-on-disabled">Start reading</button>
                    </div>
                    <span className="subhead select-none text-on-subtle">Highlight a section to start reading!</span>
                </div>
            </main>
        </div>
    )
}