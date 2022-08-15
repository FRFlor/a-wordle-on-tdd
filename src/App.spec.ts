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
            await wrapper.find("[data-role=guess]").setValue(rightAnswer)
            await wrapper.find("[data-role=guess]").trigger("keydown.enter")

            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(false)
        })

        it("displays a failure message when the player guesses wrong", async () => {
            await wrapper.find("[data-role=guess]").setValue("WRONG")
            await wrapper.find("[data-role=guess]").trigger("keydown.enter")

            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(true)
            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(false)
        })
    })

    describe("player input", () => {
        it("does not allow guesses longer than 5 letters", async () => {
            mountApp("ACTOR")

            await wrapper.find("[data-role=guess]").setValue("ACTORS")
            await wrapper.find("[data-role=guess]").trigger("keydown.enter")

            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
        })

        it("does not allow guesses that aren't real words", async () => {
            await wrapper.find("[data-role=guess]").setValue("ASDFG")
            await wrapper.find("[data-role=guess]").trigger("keydown.enter")

            expect(wrapper.find("[data-role=losing-message]").exists()).toBe(false)
        })

        test("guesses are not case sensitive", async () => {
            await wrapper.find("[data-role=guess]").setValue(rightAnswer.toLowerCase())
            await wrapper.find("[data-role=guess]").trigger("keydown.enter")

            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
        })

        it("starts with focus", async () => {
            mountApp(rightAnswer)

            expect(document.activeElement).toBe(wrapper.find("[data-role=guess]").element)
        })

        it("never loses focus", async () => {
            mountApp(rightAnswer)

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

        it.todo("marks letters that are in the correct position with the 'correct' class")
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