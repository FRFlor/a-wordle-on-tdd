import {mount, MountingOptions, VueWrapper} from "@vue/test-utils"
import App from "@/App.vue"

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

        it("displays a failure message when the player guesses wrong", async () => {
            await playerGuesses("WRONG")

            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(true)
            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(false)
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
    })

    describe("displaying hints", () => {
        it("does not render results from guesses before an answer is submitted", async () => {
            expect(wrapper.find(".correct").exists()).toBe(false)
            expect(wrapper.find(".incorrect").exists()).toBe(false)
            expect(wrapper.find(".almost").exists()).toBe(false)
        })

        it("marks letters that are in the correct position with the 'correct' class", async () => {
            // Arrange: Instantiate the App
            mountApp("WORDS")

            // Act: Have a guess that has some correct letters
            await playerGuesses("WORLD")

            // Assert: Ensure that those correct letters have the 'correct' class given to them
            const pastGuess = wrapper.find("[data-role=past-guess]")

            expect(pastGuess.find("[data-letter=W]").classes("correct")).toBe(true)
            expect(pastGuess.find("[data-letter=O]").classes("correct")).toBe(true)
            expect(pastGuess.find("[data-letter=R]").classes("correct")).toBe(true)

            expect(pastGuess.find("[data-letter=L]").classes("correct")).toBe(false)
            expect(pastGuess.find("[data-letter=D]").classes("correct")).toBe(false)
        })

        it.todo("marks letters that are not present in the word at all with the 'incorrect' class")
        it.todo("marks letters that exist in the word but are not in the proper location with the 'almost' class")
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

function assertPlayerHasWon() {
    expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
}