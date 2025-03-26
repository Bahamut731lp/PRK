CC=gcc

SRC_DIR=./src
INC_DIR=./include
BIN_DIR=./bin
ASM_DIR=./asm
OBJ_DIR=./obj

EXE_CFLAGS=-I${INC_DIR}
ASM_CFLAGS=-S -I${INC_DIR}

# Default target: runs everything
all: directories asm obj executable

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all        - Build everything"
	@echo "  directories - Create necessary directories"
	@echo "  asm        - Generate assembly files"
	@echo "  obj        - Generate object files"
	@echo "  executable - Build the final executable"
	@echo "  clean      - Clean up all generated files"

# Ensure necessary directories exist (PHONY to always run)
.PHONY: directories
directories:
	mkdir -p ${ASM_DIR} ${BIN_DIR} ${OBJ_DIR}

# Find all source files in SRC_DIR
SRC_FILES=$(wildcard $(SRC_DIR)/*.c)

# Generate object file paths in OBJ_DIR
OBJ_FILES=$(patsubst $(SRC_DIR)/%.c, $(OBJ_DIR)/%.o, $(SRC_FILES))

# Generate ASM file paths in ASM_DIR
ASM_FILES=$(patsubst $(SRC_DIR)/%.c, $(ASM_DIR)/%.s, $(SRC_FILES))

# Target to generate ASM files
asm: $(ASM_FILES)

# Target to generate object files
obj: $(OBJ_FILES)

# Target to build the final executable
executable: $(OBJ_FILES)
	$(CC) -o $(BIN_DIR)/executable $(OBJ_FILES) $(EXE_CFLAGS)

# Compile .c files to assembly
$(ASM_DIR)/%.s: $(SRC_DIR)/%.c
	$(CC) $(ASM_CFLAGS) -o $@ $<

# Compile .c files to object files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	$(CC) -c -o $@ $< $(EXE_CFLAGS)

.PHONY: clean
clean:
	rm -rf ${OBJ_DIR} ${ASM_DIR} ${BIN_DIR}
