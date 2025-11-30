"use client"

import {RiGithubFill} from "@remixicon/react";
import { useState } from "react";
import Link from "next/link";

export const GithubBadge = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed right-0 bottom-0 z-50">
            <div className="md:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`bg-[#171515] py-2.5 px-[0.95rem] rounded-l-3xl text-white flex items-center transition-all duration-300 ease-in-out ${isExpanded ? "gap-2" : ""}`}
                    aria-label="Toggle Github info"
                >
                    <RiGithubFill size={20} />
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
                        }`}
                    >
                        <div className="flex gap-1 whitespace-nowrap text-xs">
                            <Link href="https://github.com/wszostak8" target="_blank">
                                <strong>@wszostak8</strong>
                            </Link>
                            <p className="font-medium">
                                repo: <span className="text-accent font-bold">[link]</span>
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            <div className="hidden md:block bg-[#171515] p-[0.59rem] rounded-l-3xl text-white text-xs">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 items-center">
                        <RiGithubFill />
                        <Link href="https://github.com/wszostak8" target="_blank">
                            <strong>@wszostak8</strong>
                        </Link>
                    </div>
                    <div>
                        <p className="font-medium">repo: <span className="text-accent font-bold">[link]</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}