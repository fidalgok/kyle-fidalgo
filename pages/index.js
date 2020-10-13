import react from 'react';
import Link from 'next/link';

function home() {
    return (
        <div>
            <nav>
                <Link href='/timer'>
                    <a>Timer</a>
                </Link>
            </nav>
            <section>

                <h1>Welcome</h1>
                <div></div>
            </section>
        </div>
    )
}

export default home;