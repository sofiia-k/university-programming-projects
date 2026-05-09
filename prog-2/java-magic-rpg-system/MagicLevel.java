package a12432376;

/**
 * Defines the various magic levels.
 * wizards have a magic level.
 * in order to be able to use specific spells a minimum magic level is necessary.
 * Note: the compiler generated default constructor may not be sufficient for your implementation
 */
public enum MagicLevel {
	
	NOOB(50), ADEPT(100), STUDENT(200), EXPERT(500), MASTER(1000);
	
	private final int mp;
	
	MagicLevel(int mp) {
		this.mp = mp;
	}
	
	public int toMana() {
		return mp;
	}
	
	@Override
	
	public String toString() {
		int stars = switch (this) {
	        case NOOB -> 1;
	        case ADEPT -> 2;
	        case STUDENT -> 3;
	        case EXPERT -> 4;
	        case MASTER -> 5;
		};
		return "*".repeat(stars);
	}
}