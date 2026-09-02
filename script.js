/* =========================
   3D BACKGROUND
========================== */

(() => {

    const canvas =
        document.getElementById("bg3d");

    const ctx =
        canvas.getContext("2d");

    let W = 0;
    let H = 0;
    let DPR = 1;

    let stars = [];

    let snake = [];

    let t = 0;

    let mouseX = 0;
    let mouseY = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;


    function resize() {

        DPR =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        W =
            window.innerWidth;

        H =
            window.innerHeight;


        canvas.width =
            W * DPR;

        canvas.height =
            H * DPR;


        canvas.style.width =
            W + "px";

        canvas.style.height =
            H + "px";


        ctx.setTransform(
            DPR,
            0,
            0,
            DPR,
            0,
            0
        );


        const count =
            Math.min(
                120,
                Math.max(
                    55,
                    Math.floor(
                        W * H / 15000
                    )
                )
            );


        stars =
            Array.from(
                {
                    length: count
                },
                () => ({

                    x:
                        (Math.random() - .5)
                        * 1800,

                    y:
                        (Math.random() - .5)
                        * 1100,

                    z:
                        Math.random()
                        * 1200 + 120,

                    speed:
                        Math.random()
                        * .55 + .15,

                    size:
                        Math.random()
                        * 1.4 + .35

                })
            );


        snake =
            Array.from(
                {
                    length: 85
                },
                (_, i) => ({

                    x:
                        Math.cos(
                            i * .13
                        ) * 120,

                    y:
                        Math.sin(
                            i * .18
                        ) * 75,

                    z:
                        i * 7

                })
            );

    }


    function project(p) {

        const focal = 650;

        const z =
            Math.max(
                35,
                p.z
            );

        const scale =
            focal / z;


        return {

            x:
                p.x * scale +
                W / 2 +
                mouseX *
                (1 - z / 1300),

            y:
                p.y * scale +
                H / 2 +
                mouseY *
                (1 - z / 1300),

            scale

        };

    }


    function drawStars(dt) {

        for (
            const s of stars
        ) {

            s.z -=
                s.speed * dt;


            if (
                s.z < 50
            ) {

                s.z = 1250;

                s.x =
                    (Math.random() - .5)
                    * 1800;

                s.y =
                    (Math.random() - .5)
                    * 1100;

            }


            const p =
                project(s);


            const r =
                Math.max(
                    .35,
                    s.size * p.scale
                );


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                r,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    80,
                    220,
                    255,
                    ${Math.min(
                        .6,
                        p.scale * .5
                    )}
                )`;


            ctx.fill();

        }

    }


    function updateSnake() {

        t += .018;


        const head =
            snake[0];


        head.x =
            Math.sin(
                t * 1.05
            ) * 230 +
            Math.sin(
                t * 2.2
            ) * 70;


        head.y =
            Math.cos(
                t * 1.35
            ) * 150 +
            Math.sin(
                t * 2.7
            ) * 55;


        head.z =
            470 +
            Math.sin(
                t * .8
            ) * 220;


        for (
            let i = 1;
            i < snake.length;
            i++
        ) {

            const prev =
                snake[i - 1];

            const cur =
                snake[i];


            cur.x +=
                (prev.x - cur.x)
                * .18;

            cur.y +=
                (prev.y - cur.y)
                * .18;

            cur.z +=
                (
                    (prev.z + 8)
                    - cur.z
                ) * .12;

        }

    }


    function drawSnake() {

        const projected =
            snake.map(project);


        for (
            let i =
                projected.length - 1;

            i >= 0;

            i--
        ) {

            const p =
                projected[i];


            const depth =
                1 -
                i /
                projected.length;


            const radius =
                Math.max(
                    1.5,
                    (
                        9 -
                        i * .075
                    ) * p.scale
                );


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                radius * 2.5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    0,
                    229,
                    255,
                    ${
                        .025 +
                        depth * .05
                    }
                )`;


            ctx.fill();


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                radius,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    ${
                        20 +
                        Math.floor(
                            depth * 30
                        )
                    },
                    ${
                        150 +
                        Math.floor(
                            depth * 90
                        )
                    },
                    255,
                    ${
                        .25 +
                        depth * .75
                    }
                )`;


            ctx.fill();

        }


        ctx.beginPath();


        projected.forEach(
            (p, i) => {

                if (
                    i === 0
                ) {

                    ctx.moveTo(
                        p.x,
                        p.y
                    );

                } else {

                    ctx.lineTo(
                        p.x,
                        p.y
                    );

                }

            }
        );


        ctx.strokeStyle =
            "rgba(0, 229, 255, .28)";

        ctx.lineWidth = 2.2;

        ctx.shadowBlur = 18;

        ctx.shadowColor =
            "#00e5ff";

        ctx.stroke();

        ctx.shadowBlur = 0;

    }


    function animate(now) {

        const dt =
            Math.min(
                32,
                now -
                (
                    animate.last ||
                    now
                )
            );


        animate.last =
            now;


        ctx.clearRect(
            0,
            0,
            W,
            H
        );


        targetMouseX +=
            (
                mouseX -
                targetMouseX
            ) * .025;


        targetMouseY +=
            (
                mouseY -
                targetMouseY
            ) * .025;


        mouseX =
            targetMouseX;

        mouseY =
            targetMouseY;


        drawStars(dt);

        updateSnake();

        drawSnake();


        requestAnimationFrame(
            animate
        );

    }


    window.addEventListener(
        "resize",
        resize
    );


    window.addEventListener(
        "pointermove",
        (e) => {

            targetMouseX =
                (
                    e.clientX -
                    W / 2
                ) * .12;


            targetMouseY =
                (
                    e.clientY -
                    H / 2
                ) * .12;

        },
        {
            passive: true
        }
    );


    resize();

    requestAnimationFrame(
        animate
    );

})();


/* =========================
   MOBILE MENU
========================== */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const navLinks =
    document.getElementById(
        "navLinks"
    );


menuBtn.addEventListener(
    "click",
    function () {

        navLinks.classList.toggle(
            "active"
        );


        if (
            navLinks.classList.contains(
                "active"
            )
        ) {

            menuBtn.textContent =
                "✕";

        } else {

            menuBtn.textContent =
                "☰";

        }

    }
);


/* =========================
   DARK MODE
========================== */

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeBtn.textContent =
                "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


/* =========================
   REMEMBER THEME
========================== */

if (
    localStorage.getItem(
        "theme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent =
        "☀️";

}


/* =========================
   CONTACT FORM
========================== */

const form =
    document.getElementById(
        "contactForm"
    );


form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const text =
            document.getElementById(
                "text"
            ).value.trim();


        const message =
            document.getElementById(
                "message"
            );


        if (
            name === "" ||
            email === "" ||
            text === ""
        ) {

            message.textContent =
                "Please fill all fields.";

            return;

        }


        const emailPattern =
            /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;


        if (
            !email.match(
                emailPattern
            )
        ) {

            message.textContent =
                "Please enter a valid email.";

            return;

        }


        message.textContent =
            "Thank you " +
            name +
            "! Your message has been submitted.";


        form.reset();

    }
);


/* =========================
   CURRENT YEAR
========================== */

document.getElementById(
    "year"
).textContent =
    new Date().getFullYear();


/* =========================
   SYLLABUS TOGGLE
========================== */

function toggleSyllabus(id) {

    const box =
        document.getElementById(id);

    box.classList.toggle(
        "show"
    );

}
