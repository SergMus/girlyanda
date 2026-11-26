# Girlyanda coding conventions

- Use curly braces for control-flow bodies, including single-statement `if` and `else` branches and early returns.
- Leave a blank line before and after an `if` when it has a neighboring statement in the same block. Leave a blank line before `return` and `try` when they follow another statement in that block.
- In Angular templates, leave a blank line before an `@if` that follows markup or another block in the same container.
- Keep Angular templates and component styles in external `.html` and `.scss` files. Reference them with `templateUrl` and `styleUrl` or `styleUrls`. When a feature contains multiple components at the same level, give each component a subfolder for its TypeScript, template, and stylesheet.
- Start component stylesheets with `:host { display: block; }` after any Sass imports. Separate selector blocks with a blank line. Put specialized layouts such as the application shell and inline icons in their own selectors.
- Name module-level constants in `UPPER_SNAKE_CASE`. Use names such as `GLOW_OPTIONS` for module constants and `compatible` for local variables.
- Leave a blank line between a group of constants and a group of type aliases or interfaces in either order. Separate neighboring function declarations and leave a blank line between a constant and a following arrow or function expression assigned to a variable.
- Separate adjacent constant declarations with a blank line when either declaration spans multiple lines.
- After an expression statement, leave a blank line before a multiline variable declaration or a standalone multiline call with an inline callback block. Keep a declaration and its immediately following setup or registration call together.
- Keep named types, interfaces, enums, and module constants outside component files. In Angular classes, declare inputs, outputs, and queries first, then dependencies injected with `inject()`, then signals and computed values.
- Group class fields by purpose, for example injected dependencies, values used in the template, and private mutable state. Leave a blank line when visibility changes, between static and instance fields, and between readonly and mutable fields. Separate field groups, the constructor, and methods with blank lines. Preserve the initialization order of fields that depend on one another.
- Place standalone helpers in separate files named for their purpose. Keep them near the feature that uses them, as in `src/app/orders/cart-storage.ts`. Put frontend helpers used by multiple features in `src/app/shared`.
- Extract transformations with several cases into functions named for the operation they perform. Use explicit branches for different outcomes instead of nested ternaries, as in `updateCartItemQuantity` in `src/app/orders/cart-items.ts`.
- Use named checks or a predicate function for `if` conditions with three or more `&&` or `||` operators. In effects, give intermediate results names before performing the side effect.
- Build related form fields together with `createFormData()` in `src/app/shared/form-data.ts`. Set optional fields such as a photo where their conditions are checked.
- Put static data such as navigation links, contact details, configuration objects, and lookup tables in a separate file named for that data. Use `UPPER_SNAKE_CASE` for these constants, with underscores between words, as in `NAVIGATION_LINKS` in `src/app/navigation-links.ts` and `CONTACT_PHONE` in `src/app/studio/contact/contact-details.ts`.
