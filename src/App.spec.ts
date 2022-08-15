import {mount, VueWrapper} from "@vue/test-utils"
import App from "@/App.vue"

const rightAnswer = "TESTS"
describe("Wordle", () => {
    let wrapper: VueWrapper

    beforeEach(() => {
        wrapper = mount(App, {props: {rightAnswer}})
    })

    describe("setting up the game", () => {
        it("accepts a 'rightAnswer' with 5 letters without giving any warnings", () => {
            console.warn = jest.fn()

            const wrapper = mount(App, {props: {rightAnswer}})

            expect(wrapper.vm).toBeTruthy()
            expect(console.warn).not.toHaveBeenCalled()
        })

        it("provides a warning if the rightAnswer given does not have exactly 5 letters", () => {
            let hasWarnedAboutWordProp = false
            console.warn = jest.fn().mockImplementation((vueWarning) => {
                hasWarnedAboutWordProp = /invalid.*prop.*rightAnswer/ig.test(vueWarning)
            })

            mount(App, {props: {rightAnswer: "SomethingLargerThan5"}})

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
            wrapper = mount(App, {props: {rightAnswer: "ACTOR"}})

            await wrapper.find("[data-role=guess]").setValue("ACTORS")
            await wrapper.find("[data-role=guess]").trigger("keydown.enter")

            expect(wrapper.find("[data-role=winning-message]").exists()).toBe(true)
        })

        it.todo("does not allow guesses that aren't real words")
        test.todo("guesses are not case sensitive")
    })
})

