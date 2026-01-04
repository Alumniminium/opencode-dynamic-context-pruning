import { SessionState, WithParts } from "./state"

export const isMessageCompacted = (state: SessionState, msg: WithParts): boolean => {
    return msg.info.time.created < state.lastCompaction
}

export const getLastUserMessage = (messages: WithParts[]): WithParts | null => {
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i]
        if (msg.info.role === "user") {
            return msg
        }
    }
    return null
}

/**
 * Converts a wildcard pattern to a regex.
 * Supports * as a wildcard matching any characters.
 * Escapes special regex characters except *.
 */
export const wildcardToRegex = (pattern: string): RegExp => {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
    const regexPattern = `^${escaped.replace(/\*/g, ".*")}$`
    return new RegExp(regexPattern)
}

/**
 * Checks if a tool name matches any protected tool pattern.
 * Supports both exact matches and wildcard patterns (e.g., "mcp__server__prefix_*").
 */
export const isToolProtected = (toolName: string, protectedPatterns: string[]): boolean => {
    return protectedPatterns.some((pattern) => {
        if (pattern.includes("*")) {
            return wildcardToRegex(pattern).test(toolName)
        }
        return pattern === toolName
    })
}
