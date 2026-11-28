#!/usr/bin/env python3
"""Check the cross-layer contract for one UI SDK component."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def pascal_case(value: str) -> str:
    return ''.join(part[:1].upper() + part[1:] for part in value.split('-'))


def camel_case(value: str) -> str:
    pascal = pascal_case(value)
    return pascal[:1].lower() + pascal[1:]


def read(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def extract_call_bodies(source: str, component_name: str, root_only: bool = False) -> list[str]:
    prefix = r'root\s*=\s*' if root_only else ''
    pattern = re.compile(rf'{prefix}{re.escape(component_name)}\s*\(')
    bodies: list[str] = []

    for match in pattern.finditer(source):
        start = match.end()
        index = start
        paren_depth = 1
        brace_depth = 0
        bracket_depth = 0
        quote: str | None = None
        escaped = False

        while index < len(source):
            char = source[index]
            if quote is not None:
                if escaped:
                    escaped = False
                elif char == '\\':
                    escaped = True
                elif char == quote:
                    quote = None
            else:
                if char in ('"', "'", '`'):
                    quote = char
                elif char == '(':
                    paren_depth += 1
                elif char == ')':
                    paren_depth -= 1
                    if paren_depth == 0:
                        bodies.append(source[start:index])
                        break
                elif char == '{':
                    brace_depth += 1
                elif char == '}':
                    brace_depth = max(0, brace_depth - 1)
                elif char == '[':
                    bracket_depth += 1
                elif char == ']':
                    bracket_depth = max(0, bracket_depth - 1)
            index += 1
        else:
            bodies.append('')

    return bodies


def count_top_level_arguments(body: str) -> int:
    if not body.strip():
        return 0

    count = 1
    paren_depth = 0
    brace_depth = 0
    bracket_depth = 0
    quote: str | None = None
    escaped = False

    for char in body:
        if quote is not None:
            if escaped:
                escaped = False
            elif char == '\\':
                escaped = True
            elif char == quote:
                quote = None
            continue

        if char in ('"', "'", '`'):
            quote = char
        elif char == '(':
            paren_depth += 1
        elif char == ')':
            paren_depth = max(0, paren_depth - 1)
        elif char == '{':
            brace_depth += 1
        elif char == '}':
            brace_depth = max(0, brace_depth - 1)
        elif char == '[':
            bracket_depth += 1
        elif char == ']':
            bracket_depth = max(0, bracket_depth - 1)
        elif char == ',' and not (paren_depth or brace_depth or bracket_depth):
            count += 1

    return count


def check_component(root: Path, component: str, parts: list[str]) -> list[str]:
    component_name = pascal_case(component)
    component_dir = root / 'registry' / 'ui' / component
    docs_path = root / 'src' / 'content' / 'docs' / 'ui' / f'{component}.mdx'
    paths = [
        component_dir / f'{component}-props.ts',
        component_dir / f'{component}-react.tsx',
        component_dir / f'{component}-vue.tsx',
        component_dir / 'openui-react.tsx',
        component_dir / 'openui-vue.tsx',
        docs_path,
    ]
    errors: list[str] = []

    for path in paths:
        if not path.is_file():
            errors.append(f'missing file: {path.relative_to(root)}')

    if errors:
        return errors

    react_registration = read(component_dir / 'openui-react.tsx')
    vue_registration = read(component_dir / 'openui-vue.tsx')
    docs = read(docs_path)

    react_wrapper = read(component_dir / f'{component}-react.tsx')
    vue_wrapper = read(component_dir / f'{component}-vue.tsx')
    for part in parts:
        schema_name = f'{camel_case(part)}Schema'
        if not re.search(rf'export\s+const\s+{re.escape(part)}\s*=', react_registration):
            errors.append(f'React registration does not export {part}')
        if not re.search(rf'export\s+const\s+{re.escape(part)}\s*=', vue_registration):
            errors.append(f'Vue registration does not export {part}')
        if schema_name not in react_registration or schema_name not in vue_registration:
            errors.append(f'{part} is missing the shared {schema_name} in both registrations')
        if not re.search(rf'export\s+(?:const|type|interface)\s+{re.escape(part)}\b', react_wrapper):
            errors.append(f'React wrapper does not export {part}')
        if not re.search(rf'export\s+(?:const|type|interface)\s+{re.escape(part)}\b', vue_wrapper):
            errors.append(f'Vue wrapper does not export {part}')

    for label, source in (('React registration', react_registration), ('Vue registration', vue_registration)):
        field_positions = []
        for field in ('props', 'slots', 'attrs'):
            match = re.search(rf'\b{field}\s*:', source)
            if match is None:
                errors.append(f'{label} is missing top-level {field}:')
            else:
                field_positions.append((match.start(), field))
        if len(field_positions) == 3 and [field for _, field in sorted(field_positions)] != [
            'props',
            'slots',
            'attrs',
        ]:
            errors.append(f'{label} must declare props, slots, attrs in that order')
        if 'htmlAttrsSchema' not in source:
            errors.append(f'{label} does not use htmlAttrsSchema')
        if 'htmlAttrsConvert' not in source:
            errors.append(f'{label} does not use htmlAttrsConvert')
        if 'renderNode' not in source:
            errors.append(f'{label} does not render nested slots through renderNode')

    for framework, library_name, registration_path in (
        ('React', 'react.ts', f'../../ui/{component}/openui-react'),
        ('Vue', 'vue.ts', f'../../ui/{component}/openui-vue'),
    ):
        library_path = root / 'registry' / 'components' / 'openui-preview' / library_name
        library_source = read(library_path)
        if registration_path not in library_source:
            errors.append(f'{framework} preview library does not import {registration_path}')
        import_match = re.search(
            rf'import\s*\{{(?P<names>[^}}]+)\}}\s*from\s*[\'\"]{re.escape(registration_path)}[\'\"]',
            library_source,
            re.DOTALL,
        )
        imported_names = set()
        if import_match:
            imported_names = {
                name.strip().split(' as ')[-1]
                for name in import_match.group('names').split(',')
                if name.strip()
            }
        for part in parts:
            if part not in imported_names:
                errors.append(f'{framework} preview library does not import {part}')
            elif not re.search(
                rf'components\s*:\s*\[[^\]]*\b{re.escape(part)}\b',
                library_source,
                re.DOTALL,
            ):
                errors.append(f'{framework} preview library does not register {part}')

    if 'OpenUIRenderReact' not in docs:
        errors.append('docs do not render the React preview')
    if 'OpenUIRenderVue' not in docs:
        errors.append('docs do not render the Vue preview')

    for part in parts:
        calls = extract_call_bodies(docs, part)
        if not calls:
            errors.append(f'docs do not contain a call to {part}(...)')
        for index, body in enumerate(calls, start=1):
            argument_count = count_top_level_arguments(body)
            if argument_count < 3:
                errors.append(
                    f'docs {part} call {index} has {argument_count} positional arguments, expected at least 3'
                )

    for forbidden in ('console.log', 'TODO'):
        for path in (
            component_dir / f'{component}-react.tsx',
            component_dir / f'{component}-vue.tsx',
            component_dir / 'openui-react.tsx',
            component_dir / 'openui-vue.tsx',
        ):
            if forbidden in read(path):
                errors.append(f'{path.relative_to(root)} contains forbidden placeholder {forbidden}')

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('component', help='kebab-case component directory name')
    parser.add_argument('--parts', help='comma-separated public part names for a component family')
    parser.add_argument('--root', type=Path, default=Path.cwd(), help='repository root')
    args = parser.parse_args()

    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', args.component):
        parser.error('component must use kebab-case, for example date-picker')

    parts = [pascal_case(args.component)]
    if args.parts:
        parts = [part.strip() for part in args.parts.split(',') if part.strip()]

    errors = check_component(args.root.resolve(), args.component, parts)
    if errors:
        for error in errors:
            print(f'ERROR: {error}', file=sys.stderr)
        return 1

    print(f'OK: {args.component} satisfies the UI SDK component contract')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
