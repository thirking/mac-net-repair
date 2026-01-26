import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NetworkServiceItem } from "./NetworkServiceItem";
import type { NetworkService } from "@/stores/network-store";

interface NetworkServiceListProps {
  services: NetworkService[];
  selectedService: string | null;
  onSelectService: (name: string) => void;
  onReorder: (services: NetworkService[]) => void;
}

export function NetworkServiceList({
  services,
  selectedService,
  onSelectService,
  onReorder,
}: NetworkServiceListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((s) => s.name === active.id);
      const newIndex = services.findIndex((s) => s.name === over.id);

      const newServices = arrayMove(services, oldIndex, newIndex).map(
        (s, idx) => ({
          ...s,
          order: idx,
          isDefault: idx === 0,
        }),
      );

      onReorder(newServices);
    }
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-muted-foreground)]">
        没有找到网络服务
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={services.map((s) => s.name)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {services.map((service) => (
            <NetworkServiceItem
              key={service.name}
              service={service}
              isSelected={selectedService === service.name}
              onSelect={onSelectService}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
