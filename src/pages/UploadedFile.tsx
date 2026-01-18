export default function UploadedFile() {
    return (
        <div className="grid grid-cols-6 w-full max-w-full overflow-x-hidden gap-32 p-12">
            <div>
                <span>Chapter one</span>
            </div>

            <main className="col-span-5 w-full flex flex-col items-center justify-center gap-10 *:w-full *:max-w-xl">

                {/* OVERLAY */}
                <div className="select-none gradient-overlay w-full max-w-full absolute h-1/4 bg-red-50 bottom-0 fixed">
                </div>


                <div className="flex flex-col gap-1 select-none">
                    <span className="text-primary-subtle">Chapter 1.1</span>
                    <h2 className="title-1 text-on">Shared Objects and Synchronization</h2>
                </div>

                <div className="*:block *:font-serif *:paragraph-text *:text-on [&>*:not(:last-child)]:mb-6 pb-16">
                    <span>
                        The computer industry is undergoing, if not another revolution, certainly a vigorous shaking-up. The major chip manufacturers have, for the time being at least, given up trying to make processors run faster. Moore’s Law has not been repealed: each year, more and more transistors fit into the same space, but their clock speed cannot be increased without overheating. Instead, manufacturers are turning to “multicore” architectures, in which multiple processors (cores) communicate directly through shared hardware caches. Multiprocessor chips make computing more effective by exploiting parallelism: harnessing multiple processors to work on a single task.
                    </span>

                    <span>
                        The computer industry is undergoing, if not another revolution, certainly a vigorous shaking-up. The major chip manufacturers have, for the time being at least, given up trying to make processors run faster. Moore’s Law has not been repealed: each year, more and more transistors fit into the same space, but their clock speed cannot be increased without overheating. Instead, manufacturers are turning to “multicore” architectures, in which multiple processors (cores) communicate directly through shared hardware caches. Multiprocessor chips make computing more effective by exploiting parallelism: harnessing multiple processors to work on a single task.
                    </span>

                    <span>
                        The computer industry is undergoing, if not another revolution, certainly a vigorous shaking-up. The major chip manufacturers have, for the time being at least, given up trying to make processors run faster. Moore’s Law has not been repealed: each year, more and more transistors fit into the same space, but their clock speed cannot be increased without overheating. Instead, manufacturers are turning to “multicore” architectures, in which multiple processors (cores) communicate directly through shared hardware caches. Multiprocessor chips make computing more effective by exploiting parallelism: harnessing multiple processors to work on a single task.
                    </span>

                    <span>
                        The computer industry is undergoing, if not another revolution, certainly a vigorous shaking-up. The major chip manufacturers have, for the time being at least, given up trying to make processors run faster. Moore’s Law has not been repealed: each year, more and more transistors fit into the same space, but their clock speed cannot be increased without overheating. Instead, manufacturers are turning to “multicore” architectures, in which multiple processors (cores) communicate directly through shared hardware caches. Multiprocessor chips make computing more effective by exploiting parallelism: harnessing multiple processors to work on a single task.
                    </span>
                </div>

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