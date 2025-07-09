// Services
import { TweenService } from "@rbxts/services";

// Packages
import Vide from "@rbxts/vide";

// Vide Components
const { source, effect } = Vide;

const number = (
	target: Vide.Source<number>,
	speed: number,
	easingStyle?: Enum.EasingStyle,
	easingDirection?: Enum.EasingDirection,
): Vide.Source<number> => {
	const animated = source(target());

	let currentTween: Tween | undefined;
	const numberValue = new Instance("NumberValue");
	numberValue.Value = animated();

	numberValue.GetPropertyChangedSignal("Value").Connect(() => {
		const val = numberValue.Value;
		const goal = target();

		if (math.abs(val - goal) < 0.01) {
			animated(goal);
		} else {
			animated(val);
		}
	});

	effect(() => {
		const nextTarget = target();

		if (currentTween) {
			currentTween.Cancel();
			currentTween = undefined;
		}

		const currentValue = animated();

		numberValue.Value = currentValue;

		const tweenInfo = new TweenInfo(
			speed / 50,
			easingStyle || Enum.EasingStyle.Linear,
			easingDirection || Enum.EasingDirection.Out,
		);
		currentTween = TweenService.Create(numberValue, tweenInfo, {
			Value: nextTarget,
		});
		currentTween.Play();
	});

	return animated;
};

const tweens = {
	number,
};

export default tweens;
