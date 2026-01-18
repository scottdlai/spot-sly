export default function UploadedFile() {
    return (
        <div className="grid grid-cols-6 min-h-screen min-w-screen gap-40 p-12">
            <div>
                <span>Chapter one</span>
            </div>

            <main className="col-span-5 w-full flex flex-col items-center justify-center *:max-w-xl *:w-full gap-10">
                <div className="flex flex-col gap-1.5">
                    <span className="text-primary-subtle">Chapter 1.1</span>
                    <h2 className="title-1 text-text-primary">Shared Objects and Synchronization</h2>
                </div>

                <span className="block font-serif paragraph-text">
                    The computer industry is undergoing, if not another revolution, certainly a vigorous shaking-up. The major chip manufacturers have, for the time being at least, given up trying to make processors run faster. Moore’s Law has not been repealed: each year, more and more transistors fit into the same space, but their clock speed cannot be increased without overheating. Instead, manufacturers are turning to “multicore” architectures, in which multiple processors (cores) communicate directly through shared hardware caches. Multiprocessor chips make computing more effective by exploiting parallelism: harnessing multiple processors to work on a single task.
                </span>
            </main>
        </div>
    )
}