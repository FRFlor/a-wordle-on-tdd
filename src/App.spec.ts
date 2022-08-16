import {mount, MountingOptions, VueWrapper} from "@vue/test-utils"
import App from "@/App.vue"
import {SETTINGS} from "@/settings"

const rightAnswer = "TESTS"

let wrapper: VueWrapper

describe("Wordle", () => {
    beforeEach(() => {
        mountApp(rightAnswer)
    })

    describe("setting up the game", () => {
        it("accepts a 'rightAnswer' with 5 letters without giving any warnings", () => {
            console.warn = jest.fn()

            mountApp(rightAnswer)

            expect(wrapper.vm).toBeTruthy()
            expect(console.warn).not.toHaveBeenCalled()
        })

        it("provides a warning if the rightAnswer given does not have exactly 5 letters", () => {
            let hasWarnedAboutWordProp = false
            console.warn = jest.fn().mockImplementation((vueWarning) => {
                hasWarnedAboutWordProp = /invalid.*prop.*rightAnswer/ig.test(vueWarning)
            })

            mountApp("SOMETHING_LARGER_THAN_5_CHARACTERS")

            expect(hasWarnedAboutWordProp).toBe(true)
        })

        it("provides a warning if the rightAnswer given is not in allowed words", () => {
            let hasWarnedAboutWordProp = false
            console.warn = jest.fn().mockImplementation((vueWarning) => {
                hasWarnedAboutWordProp = /invalid.*prop.*rightAnswer/ig.test(vueWarning)
            })

            mountApp("ASDFG")

            expect(hasWarnedAboutWordProp).toBe(true)
        })

        it("provides a warning if the rightAnswer given is not in uppercase", () => {
            let hasWarnedAboutWordProp = false
            console.warn = jest.fn().mockImplementation((vueWarning) => {
                hasWarnedAboutWordProp = /invalid.*prop.*rightAnswer/ig.test(vueWarning)
            })

            mountApp("tests")

            expect(hasWarnedAboutWordProp).toBe(true)
        })
    })

    describe("ending the game", () => {
        it("does not display game ending messages until the game is over", () => {
            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(false)
            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(false)
        })

        it("displays a victory message when the player guesses the right word correctly", async () => {
            await playerGuesses(rightAnswer)

            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(false)
        })

        it("only fails the game if the player has guessed wrong 6 times in a roll", async () => {
            for (let i = 0; i < SETTINGS.numberOfAttemptsAllowed - 1; i++) {
                await playerGuesses("WRONG")
            }

            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(false)

            await playerGuesses("WRONG")

            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(false)
            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(true)
        })
    })

    describe("player input", () => {
        it("does not allow guesses longer than 5 letters", async () => {
            mountApp("ACTOR")

            await playerGuesses("ACTORS")

            assertPlayerHasWon()
        })

        it("does not allow guesses that aren't real words", async () => {
            await playerGuesses("ASDFG")

            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(false)
        })

        test("guesses are not case sensitive", async () => {
            await playerGuesses(rightAnswer.toLowerCase())

            assertPlayerHasWon()
        })

        it("starts with focus", async () => {
            expect(document.activeElement).toBe(wrapper.find("[data-role=guess]").element)
        })

        it("never loses focus", async () => {
            await wrapper.find("[data-role=guess]").trigger("blur")

            expect(document.activeElement).toBe(wrapper.find("[data-role=guess]").element)
        })

        it("clears the input after each attempt", async () => {
            await playerGuesses("WRONG")

            expect(getWhatPlayerInputShows()).toEqual("")
        })

        it("Only allow letters to be provided", async () => {
            await playerGuesses("1A B!")

            expect(getWhatPlayerInputShows()).toEqual("AB")
        })

        it("Displays the current guess being typed at the current attempt view", async () => {
            await playerGuesses("BY")

            const topGuessView = wrapper.findAll("[data-role=guess-view]")[0]
            expect(topGuessView.text()).toEqual("BY")

            await playerGuesses("BYTES")

            await playerGuesses("TRI")

            const secondGuessView = wrapper.findAll("[data-role=guess-view]")[1]
            expect(secondGuessView.text()).toEqual("TRI")
        })
    })

    describe("displaying hints", () => {
        it("renders all allowed attempts as empty blocks since the start", async () => {
            expect(wrapper.findAll("[data-role=guess-view]")).toHaveLength(SETTINGS.numberOfAttemptsAllowed)

            wrapper.findAll("[data-role=guess-view]").forEach((pastGuess) => {
                    expect(pastGuess.findAll("[data-role=letter]")).toHaveLength(SETTINGS.wordSize)
                }
            )
        })

        it("keeps the number of letter blocks consistent as the user types a new guess", async () => {
            const guessView = wrapper.find("[data-role=guess-view]")

            const guess = "GREAT"

            for (let numberOfCharactersTyped = 0; numberOfCharactersTyped < guess.length; numberOfCharactersTyped++) {
                const inProgressGuess = guess.slice(0, numberOfCharactersTyped)
                await playerGuesses(inProgressGuess)

                expect(guessView.findAll("[data-role=letter]")).toHaveLength(SETTINGS.wordSize)
            }
        })

        it("displays all previous guesses", async () => {
            const guesses = ["TRIAL", "TEMPO", "GREAT", "WRONG", "BYTES", "TESTS"]

            for (const guess of guesses) {
                await playerGuesses(guess)
            }

            const pastGuesses = wrapper.findAll("[data-role=guess-view]")

            expect(pastGuesses).toHaveLength(SETTINGS.numberOfAttemptsAllowed)

            pastGuesses.forEach((pastGuess, i) => {
                    expect(pastGuess.text()).toEqual(guesses[i])
                }
            )
        })

        it("does not render results from guesses before an answer is submitted", async () => {
            const guess = "GREAT"

            for (let countOfCharacters = 0; countOfCharacters < guess.length - 1; countOfCharacters++) {
                const inProgressGuess = guess.slice(0, countOfCharacters)
                await playerGuesses(inProgressGuess)

                expect(wrapper.find(".correct").exists()).toBe(false)
                expect(wrapper.find(".incorrect").exists()).toBe(false)
                expect(wrapper.find(".almost").exists()).toBe(false)
            }
        })

        it("marks letters that are in the correct position with the 'correct' class", async () => {
            mountApp("WORDS")

            await playerGuesses("WORLD")

            const pastGuess = wrapper.find("[data-role=guess-view]")
            expect(pastGuess.find("[data-letter=W]").classes("correct")).toBe(true)
            expect(pastGuess.find("[data-letter=O]").classes("correct")).toBe(true)
            expect(pastGuess.find("[data-letter=R]").classes("correct")).toBe(true)

            expect(pastGuess.find("[data-letter=L]").classes("correct")).toBe(false)
            expect(pastGuess.find("[data-letter=D]").classes("correct")).toBe(false)
        })

        it("marks letters that are not present in the word at all with the 'incorrect' class", async () => {
            mountApp("WORDS")

            await playerGuesses("WORLD")

            const pastGuess = wrapper.find("[data-role=guess-view]")
            expect(pastGuess.find("[data-letter=W]").classes("incorrect")).toBe(false)
            expect(pastGuess.find("[data-letter=O]").classes("incorrect")).toBe(false)
            expect(pastGuess.find("[data-letter=R]").classes("incorrect")).toBe(false)

            expect(pastGuess.find("[data-letter=L]").classes("incorrect")).toBe(true)

            expect(pastGuess.find("[data-letter=D]").classes("incorrect")).toBe(false)
        })

        it("marks letters that exist in the word but are not in the right location with the 'almost' class",
            async () => {
                mountApp("WORDS")

                await playerGuesses("WORLD")

                const pastGuess = wrapper.find("[data-role=guess-view]")
                expect(pastGuess.find("[data-letter=W]").classes("almost")).toBe(false)
                expect(pastGuess.find("[data-letter=O]").classes("almost")).toBe(false)
                expect(pastGuess.find("[data-letter=R]").classes("almost")).toBe(false)
                expect(pastGuess.find("[data-letter=L]").classes("almost")).toBe(false)

                expect(pastGuess.find("[data-letter=D]").classes("almost")).toBe(true)
            })
    })
})

function mountApp(rightAnswer: string): void {
    document.body.innerHTML = "<div id=\"app\"></div>"
    wrapper = mount(App, {
            props: {rightAnswer},
            attachTo: document.getElementById("app")
        } as MountingOptions<any>
    )
}

async function playerGuesses(guess: string): Promise<void> {
    await wrapper.find("[data-role=guess]").setValue(guess)
    await wrapper.find("[data-role=guess]").trigger("keydown.enter")
}

function getWhatPlayerInputShows(): string {
    return wrapper.find<HTMLInputElement>("[data-role=guess]").element.value
}

function assertPlayerHasWon() {
    expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
}