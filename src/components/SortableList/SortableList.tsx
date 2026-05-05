import "./SortableList.css";

import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";

import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type SortableHeader = {
	key: string;
	label: string;
	width?: number;
	align?: "left" | "center" | "right";
};

type SortableListProps<T> = {
	headers?: SortableHeader[];

	items: T[];
	onChange: (items: T[]) => void;

	getId: (item: T) => string;

	renderItem: (item: T) => React.ReactNode;
};

export function SortableList<T>({
	headers,
	items,
	onChange,
	getId,
	renderItem,
}: SortableListProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex((item) => getId(item) === active.id);

		const newIndex = items.findIndex((item) => getId(item) === over.id);

		onChange(arrayMove(items, oldIndex, newIndex));
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map(getId)}
				strategy={verticalListSortingStrategy}
			>
				<div className="ui-sortable-list">
					{headers && (
						<div className="ui-sortable-list-header">
							{headers.map((header) => (
								<div
									key={header.key}
									className="ui-sortable-list-header-item"
									style={{
										flex: header.width ? `0 0 ${header.width}px` : 1,
										textAlign: header.align ?? "left",
									}}
								>
									{header.label}
								</div>
							))}
						</div>
					)}
					{items.map((item) => (
						<SortableItem
							key={getId(item)}
							id={getId(item)}
						>
							{renderItem(item)}
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}

type SortableItemProps = {
	id: string;
	children: React.ReactNode;
};
const SortableItem = ({ id, children }: SortableItemProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};
	return (
		<div
			ref={setNodeRef}
			style={style}
			className="ui-sortable-item"
			{...attributes}
			{...listeners}
		>
			{children}
		</div>
	);
};
